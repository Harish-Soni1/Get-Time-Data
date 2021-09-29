const http = require('https')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require('express')
const app = express()


app.get('/getTimeStories', (req, res) => {

    try {

        http.get(
            {
                host: 'time.com',
                path: 'https://time.com',
                method: 'GET'
            }, (resp) => {
                var responseString = '';
                resp.on('data', function (data) {
                    responseString += data;
                });
                resp.on('end', function () {

                    const dom = new JSDOM(responseString);
                    let dt = dom.window.document.querySelector(".latest").querySelector(".swipe-h").querySelectorAll('li')
                    let jsonData = []
                    for (let i = 0; i < dt.length; i++) {
                        jsonData.push({
                            title: dt[i].querySelector('.title').querySelector('a').textContent,
                            link: 'https://time.com' + dt[i].querySelector('.title').querySelector('a').getAttribute("href")
                        })
                    }

                    // console.log(jsonData);
                    res.json({status: 200, message: "Success", data: jsonData})

                });
                resp.on('error', function (err) {

                    console.log("error ==> ", err);
                    res.json({status: 200, message: "Failed", data: error.toString()})

                })
            })

    } catch (error) {
        res.json({ status: 400, message: error.toString() })
    }

})

app.listen(process.env.PORT)