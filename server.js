const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const sellersFile = "./sellers.json";

// Middleware
app.use(express.static("KOD STORES"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads folder
const upload = multer({ dest: "KOD STORES/uploads" });

// Routes

// Get sellers.json
app.get("/sellers.json", (req, res) => {
    fs.readFile(sellersFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({});
        }
        res.json(JSON.parse(data || "{}"));
    });
});

// Verify Payment
app.post("/payments/verify", async (req, res) => {
    const { transaction_id, email } = req.body;

    try {
        const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
            headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` }
        });
        const result = await response.json();

        if (result.status === "success" && result.data.status === "successful") {
            const sellers = readSellers();
            sellers[email] = {
                paid: true,
                tx_ref: result.data.tx_ref,
                receipt: ""
            };
            saveSellers(sellers);
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

// Upload Receipt
app.post("/upload-receipt", upload.single("receipt"), (req, res) => {
    const email = req.body.email;
    const receiptPath = req.file ? `uploads/${req.file.filename}` : "";

    const sellers = readSellers();
    sellers[email] = {
        paid: false,
        tx_ref: "",
        receipt: receiptPath
    };
    saveSellers(sellers);

    res.send("Receipt uploaded. Waiting for admin approval.");
});

// Approve seller
app.post("/approve", (req, res) => {
    const email = req.body.email;
    const sellers = readSellers();

    if (sellers[email]) {
        sellers[email].paid = true;
        saveSellers(sellers);
    }

    res.sendStatus(200);
});

// Reject seller
app.post("/reject", (req, res) => {
    const email = req.body.email;
    const sellers = readSellers();

    if (sellers[email]) {
        delete sellers[email];
        saveSellers(sellers);
    }

    res.sendStatus(200);
});

// Admin Login
app.post("/admin-login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.send("OK");
    } else {
        res.status(401).send("Invalid password");
    }
});

// Helpers
function readSellers() {
    try {
        const data = fs.readFileSync(sellersFile, "utf8");
        return JSON.parse(data || "{}");
    } catch {
        return {};
    }
}

function saveSellers(sellers) {
    fs.writeFileSync(sellersFile, JSON.stringify(sellers, null, 2));
}

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
