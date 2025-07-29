const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

let printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: 'usb',
});

async function printTest() {
  printer.println("Test Print");
  printer.cut();

  let isConnected = await printer.isPrinterConnected();
  console.log("Connected:", isConnected);

  let success = await printer.execute();
  console.log("Success:", success);
}

printTest();
