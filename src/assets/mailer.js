const nodemailer = require('nodemailer');
const { getAll } = require('../queries/delegates');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ahmed.khallaf2@aiesec.net',
        pass: 'AIESECpass1'
    }
});

const xfunc = (x) => {
    let mailOptions = {
        from: 'ahmed.khallaf2@aiesec.net',
        to: delegate.email,
        subject: 'Your Activate19 Conference QR Code for checking-in!',
        html: `<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=ActCU-${delegate.id}" />`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(x, error);
        } else {
            console.log('Email sent: ' + x + ' - ' + info.response + delegate.email);
        }
    });
    if (x < 580)
        setTimeout(xfunc, 3000);
};

getAll(1, 650)
    .then((delegates) => {
        console.log(delegates);
        console.log('------------- STARTED ---------------');
        x = 0;
        delegates.forEach(delegate => {
            setTimeout(() => {
                x++;
                let mailOptions = {
                    from: 'ahmed.khallaf2@aiesec.net',
                    to: delegate.email,
                    subject: 'Your Activate19 Conference QR Code for checking-in!',
                    html: `<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=ActCU-${delegate.id}" />`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(x, error);
                    } else {
                        console.log('Email sent: ' + x + ' - ' + info.response + delegate.email);
                    }
                });
            }, 1500);
        });
        console.log('------------- ENDED ---------------');
    })
    .catch((err) => res.status(403).json(error(`Error: ${err}.`)))
