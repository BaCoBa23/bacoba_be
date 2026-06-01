const { Storage } = require("megajs");
const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
require('dotenv').config();

const MEGA_EMAIL = process.env.MEGA_EMAIL;
const MEGA_PASSWORD = process.env.MEGA_PASSWORD;
const DB_PATH = path.resolve(__dirname, "../../", process.env.DB_RELATIVE_PATH || "prisma/dev.db");

/**
 * Logic thực hiện backup và upload lên Mega (Không nén)
 */
async function runBackup() {
    const dateStr = new Date().toISOString().split("T")[0];
    const ext = path.extname(DB_PATH); // Lấy đuôi file gốc (.db hoặc .sqlite)
    const backupFileName = `dev-db-backup-${dateStr}${ext}`;

    console.log(`[${new Date().toLocaleString()}] 📦 Bắt đầu backup hàng ngày (không nén)...`);

    try {
        const storage = await new Storage({
            email: MEGA_EMAIL,
            password: MEGA_PASSWORD,
        }).ready;

        // 1. Kiểm tra file gốc có tồn tại không
        if (!fs.existsSync(DB_PATH)) {
            throw new Error(`Không tìm thấy file database tại: ${DB_PATH}`);
        }

        // 2. Lấy thông tin file để upload
        const stats = fs.statSync(DB_PATH);
        const fileStream = fs.createReadStream(DB_PATH);

        console.log(`Đang upload: ${backupFileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

        // 3. Upload trực tiếp stream file gốc lên Mega
        await storage.upload({
            name: backupFileName,
            size: stats.size,
        }, fileStream).complete;

        console.log(`✅ Backup thành công: ${backupFileName}`);

    } catch (error) {
        console.error("❌ Lỗi trong quá trình backup:", error.message);
    }
}

/**
 * Logic xóa các bản cũ (Cleanup)
 */
async function cleanOldBackups() {
    console.log(`[${new Date().toLocaleString()}] 🧹 Bắt đầu dọn dẹp định kỳ trên Mega...`);
    try {
        const storage = await new Storage({
            email: MEGA_EMAIL,
            password: MEGA_PASSWORD,
        }).ready;

        const files = storage.root.children;
        if (!files || files.length === 0) return;

        // Giữ lại các bản trong vòng 7 ngày gần nhất
        const threshold = Date.now() - 14 * 24 * 60 * 60 * 1000; 

        for (const file of files) {
            // Kiểm tra tên file bắt đầu bằng prefix và thời gian tạo cũ hơn threshold
            if (file.name.startsWith("dev-db-backup-") && file.timestamp < threshold) {
                try {
                    await file.delete();
                    console.log(`🗑️ Đã xóa bản cũ: ${file.name}`);
                } catch (delErr) {
                    console.error(`Không thể xóa file ${file.name}:`, delErr.message);
                }
            }
        }
    } catch (error) {
        console.error("❌ Lỗi dọn dẹp Mega:", error.message);
    }
}

/**
 * Thiết lập lịch chạy
 */
const startBackupCron = () => {
    // 1. Backup mỗi ngày vào lúc 21:00 (9h tối)
    // Cấu pháp: Phút(0) Giờ(21) Ngày(*) Tháng(*) Thứ(*)
    cron.schedule("0 21 * * *", runBackup, {
        timezone: "Asia/Ho_Chi_Minh",
    });

    // 2. Dọn dẹp vào lúc 22:00 (10h tối) Chủ Nhật hàng tuần
    // Cấu pháp: Phút(0) Giờ(22) Ngày(*) Tháng(*) Thứ(0)
    cron.schedule("0 22 * * 0", cleanOldBackups, {
        timezone: "Asia/Ho_Chi_Minh",
    });

    console.log("🚀 Hệ thống Cron đã sẵn sàng:");
    console.log("- Backup: 21:00 hàng ngày (File gốc)");
    console.log("- Cleanup: 22:00 Chủ Nhật hàng tuần");
};

module.exports = startBackupCron;