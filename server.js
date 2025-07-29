const express = require('express');
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;
const app = express();

app.use(express.json());
let isConnected = await printer.isPrinterConnected();
console.log("Status koneksi printer:", isConnected);

// Ganti dengan API key jika perlu keamanan
const API_KEY = 'secret123';

app.post('/print', async (req, res) => {
    if (req.headers['x-api-key'] !== API_KEY) {
        return res.status(403).send('Forbidden');
    }

    const { meja, items } = req.body;
    if (!meja || !Array.isArray(items)) {
        return res.status(400).send('Bad Request');
    }

    let printer = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: 'usb', // printer RPP02N pakai USB
        characterSet: 'SLOVENIA',
        removeSpecialCharacters: false,
        lineCharacter: "=",
    });

    try {
        printer.alignCenter();
        printer.println("=== ORDER DAPUR ===");
        printer.println(`Meja: ${meja}`);
        printer.drawLine();

        printer.alignLeft();
        items.forEach(item => {
            printer.println(`- ${item.nama} x${item.qty}`);
        });

        printer.drawLine();
        printer.newLine();
        printer.cut();

        let success = await printer.execute();

        if (success) {
            res.send("✅ Order berhasil dicetak");
        } else {
            res.status(500).send("❌ Gagal cetak");
        }

    } catch (e) {
        console.error("Printer Error:", e);
        res.status(500).send("❌ Error saat mencetak");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🖨️  Print Server listening at http://localhost:${PORT}`);
});
