const pdf = require("pdf-creator-node");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
let info = require("./data.json");
app.post("/download_invoice", async (req, res) => {
  try {
    const {UserData,Total,Showroom,Model} = req.body;
    // console.log(Data);
    // const Products = UserData.Products;
    // const User = UserData.User;
    console.log("Pdf is generating");
    const html = fs.readFileSync("invoice.html", "utf8");
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    let Today = `Date of Purchase ${currentDate}`;

    // let total = 0;
    // Data.Products.map((e) => {
    //   total += Number(e.price);
    // });

    const options = {
      format: "A4",
      orientation: "portrait",
      border: "7mm",
      footer: {
        height: "40px",
        contents: {
          first: "",
          2: "", // Any page number is working. 1-based index
          default:
            '<p style="color: #444;font-family: Arial, Helvetica, sans-serif;text-align:center"><span>{{page}}</span>/<span>{{pages}}</span></p>', // fallback value
          last: "",
        },
      },
    };

    const document = {
      html: html,
      data: {
        Products: Model.Bill,
        User: UserData,
        Vehical: Model.VehicalData,
        date: Today,
        TotalInWords: Total,
        bank: Showroom.BankDetails,
        Marchent:Showroom.Marchent
        // gst: Math.floor(total / 28),
        // gross: Math.floor(total - total / 28),
      },
      path: "./output.pdf",
      type: "",
    };

    pdf
      .create(document, options)
      .then((responce) => {
        console.log(responce);
        // res.send(Promise.resolve())
        return res.send("PDF Created");
      })
      .catch((error) => {
        // res.send(Promise.reject());
        console.error(error.message);
        return res.send(error.code);
      });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/fetch-pdf", (req, res) => {
  res.download("./output.pdf");
});
// const Products = [
//   {
//     name: "iphone13",
//     price: 12326,
//   },
//   {
//     name: "samsung s22",
//     price: 3242,
//   },
//   {
//     name: "ipad",
//     price: 26323,
//   },
// ];

// const userInfo = [
//   { name: "madhan", email: "madhanm282@gmail.com", mobile: "8500222928" },
// ];

app.listen(8080, () => {
  console.log("listening on 8080");
});
