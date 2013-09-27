var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "crunchlytics@gmail.com",
        pass: "crunchl12"
    }
});

var mailOptions = {
    from: "Crunchlytics Team<crunchlytics@gmail.com>",
    to: "eddyfh@gmail.com",
    subject: "Hello world!",
    // plaintext body
    text: 'Hello to myself!',

    // HTML body
    html:'<p><b>Hello</b> to myself <img src="http://eofdreams.com/data_images/dreams/cat/cat-06.jpg"/></p>'+
         '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@node"/></p>'
};

transport.sendMail(mailOptions);