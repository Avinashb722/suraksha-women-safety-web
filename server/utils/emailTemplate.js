const gmailContent = (verificationToken) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <h1 style="color: #008080; text-align: center; margin-bottom: 30px;">Email Verification</h1>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; text-align: center;">
            <p style="font-size: 16px; color: #333; margin-bottom: 30px;">Click the button below to verify your email address:</p>
            <a href="${process.env.BACKEND_URL}/api/v1/users/emailverify/${verificationToken}" 
               style="display: inline-block; background-color: #008080; color: #ffffff; font-size: 16px; 
                      text-decoration: none; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
              Verify Email Address
            </a>
            <p style="font-size: 14px; color: #666; margin-top: 30px;">If the button doesn't work, copy and paste this link:</p>
            <p style="font-size: 12px; color: #008080; word-break: break-all;">${process.env.BACKEND_URL}/api/v1/users/emailverify/${verificationToken}</p>
          </div>
        </div>
      </body>
      </html>
      `;
  }

  const successFullVerification = () => {
    return `
    <h1 style="color: #008080; font-family: 'Arial', sans-serif; text-align: center;">Congratulations!</h1>
    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px;">
      <p style="font-size: 16px; font-family: 'Arial', sans-serif; color: #444; text-align: center;">You have successfully verified your email.</p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="${process.env.BACKEND_URL}/api/v1/users/login" style="display: inline-block; background-color: #008080; color: #fff; font-size: 18px; font-family: 'Arial', sans-serif; text-decoration: none; padding: 10px 20px; border-radius: 5px; border: 2px solid #008080; transition: background-color 0.3s ease-in-out;">
          Go to Home Page
        </a>
      </div>
    </div>
  `;
  }
  

const mapLocation = (lat,long,username,pincode,formatted_address) => `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <style>
        .abc {
            background-color: #d3d3d3;
            max-width: 768px;
            color: black;

        }

        b {
            color: red;
        }

        .custom-btn {
            width: 130px;
            height: 40px;
            color: #fff;
            border-radius: 5px;
            padding: 10px 25px;
            font-family: 'Lato', sans-serif;
            font-weight: 500;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            display: inline-block;
            box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
                7px 7px 20px 0px rgba(0, 0, 0, .1),
                4px 4px 5px 0px rgba(0, 0, 0, .1);
            outline: none;
        }

        .btn-1 {
            background: rgb(96, 9, 240);
            background: linear-gradient(0deg, rgba(96, 9, 240, 1) 0%, rgba(129, 5, 240, 1) 100%);
            border: none;
        }

        .btn-1:before {
            height: 0%;
            width: 2px;
        }

        .btn-1:hover {
            box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, .5),
                -4px -4px 6px 0 rgba(116, 125, 136, .5),
                inset -4px -4px 6px 0 rgba(255, 255, 255, .2),
                inset 4px 4px 6px 0 rgba(0, 0, 0, .4);
        }
    </style>
    <center>
        <div class="abc" style="
            background-image: linear-gradient(to right top, #940915, #7c0916, #650b16, #4d0c14, #370b0f)">
                    <img src="https://safesiren.vercel.app/static/media/logo.7f997af41092472d096a.png" style="width: 30%; margin-top: 25px; " alt="">

            <h1 style="color: red;">Alert</h1> <br />
            <p style="color:white;font-size: 18px;">Hey user you are recieving this mail because one of your close member added you as
                emergency contact</p>
            <p style="color:white;font-size: 18px;">Hey user you are recieving this mail because one of your close member added you as
                <p style="color: white;"> <b>${username}</b> seems to be in danger as he/she has triggered alarm<br /><br />
                <b>${username}</b> sent an emergency message to you</p>
            <p></p>
            <br />
            <div style="color: white;font-size: 18px;">
                <p>The Location from where alert was sent is :</p>

                <p>FORMATED ADDRESS: ${formatted_address}</p>
                <p>POSTAL CODE : ${pincode}</p>

                <a style="text-decoration: none" href="https://maps.google.com/maps?q=${lat},${long}&hl=en&z=14&amp">
                    <button class="" style="background-color: blueviolet; font-size: 28px; color: white; border-radius: 5px; padding: 12px;">Check Location</button>
                </a>
                <br />
                <br />
            </div>
        </div>
    </center>

</body>

</html>`

const mapLocationNearby = (lat,long,username,pincode,formatted_address) => `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <style>
        .abc {
            background-color: #d3d3d3;
            max-width: 768px;
            color: black;

        }

        b {
            color: red;
        }

        .custom-btn {
            width: 130px;
            height: 40px;
            color: #fff;
            border-radius: 5px;
            padding: 10px 25px;
            font-family: 'Lato', sans-serif;
            font-weight: 500;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            display: inline-block;
            box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, .5),
                7px 7px 20px 0px rgba(0, 0, 0, .1),
                4px 4px 5px 0px rgba(0, 0, 0, .1);
            outline: none;
        }

        .btn-1 {
            background: rgb(96, 9, 240);
            background: linear-gradient(0deg, rgba(96, 9, 240, 1) 0%, rgba(129, 5, 240, 1) 100%);
            border: none;
        }

        .btn-1:before {
            height: 0%;
            width: 2px;
        }

        .btn-1:hover {
            box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, .5),
                -4px -4px 6px 0 rgba(116, 125, 136, .5),
                inset -4px -4px 6px 0 rgba(255, 255, 255, .2),
                inset 4px 4px 6px 0 rgba(0, 0, 0, .4);
        }
    </style>
    <center>
        <div class="abc" style="
            background-image: linear-gradient(to right top, #940915, #7c0916, #650b16, #4d0c14, #370b0f)">
                    <img src="https://safesiren.vercel.app/static/media/logo.7f997af41092472d096a.png" style="width: 30%; margin-top: 25px; " alt="">

            <h1 style="color: red;">Emergency Situation In Your Area</h1> <br />
            <p style="color:white;font-size: 18px;">Hey user you are recieving this mail because Emergency triggered in your area</p>
                <p style="color: white;"> <b>${username}</b> seems to be in danger as he/she has triggered alarm<br /><br />
                <b>${username}</b> sent an emergency message to you. If possible try to help them</p>
            <p></p>
            <br />
            <div style="color: white;font-size: 18px;">
                <p>The Location from where alert was sent is :</p>

                <p>FORMATED ADDRESS: ${formatted_address}</p>
                <p>POSTAL CODE : ${pincode}</p>

                <a style="text-decoration: none" href="https://maps.google.com/maps?q=${lat},${long}&hl=en&z=14&amp">
                    <button class="" style="background-color: blueviolet; font-size: 28px; color: white; border-radius: 5px; padding: 12px;">Check Location</button>
                </a>
                <br />
                <br />
            </div>
        </div>
    </center>

</body>

</html>`



const trackingStartTemplate = (username, timestamp) => `
<html>
<head>
    <meta charset="UTF-8">
    <title>Tracking Started</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #2c5aa0; text-align: center;">🚀 Tracking Started</h2>
        <p style="font-size: 16px; color: #333;"><strong>${username}</strong> has started location tracking.</p>
        <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Started at:</strong> ${timestamp}</p>
            <p>You will receive location updates every 2 minutes until they confirm safe arrival.</p>
        </div>
        <p style="font-size: 14px; color: #666; text-align: center;">This is an automated message from the Women Safety App tracking system.</p>
    </div>
</body>
</html>`;

const trackingLocationTemplate = (username, lat, long, formatted_address, timestamp) => `
<html>
<head>
    <meta charset="UTF-8">
    <title>Location Update</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #2c5aa0; text-align: center;">📍 Location Update</h2>
        <p style="font-size: 16px; color: #333;">Hi! This is an automated location update for <strong>${username}</strong>.</p>
        <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Time:</strong> ${timestamp}</p>
            <p><strong>Location:</strong> ${formatted_address}</p>
        </div>
        <div style="text-align: center; margin: 20px 0;">
            <a href="https://maps.google.com/maps?q=${lat},${long}" 
               style="background: #2c5aa0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                📍 View on Google Maps
            </a>
        </div>
        <p style="font-size: 14px; color: #666; text-align: center;">This is an automated message from the Women Safety App tracking system.</p>
    </div>
</body>
</html>`;

const safeArrivalTemplate = (username, lat, long, formatted_address, timestamp) => `
<html>
<head>
    <meta charset="UTF-8">
    <title>Safe Arrival</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #27ae60; text-align: center;">✅ Safe Arrival Confirmed</h2>
        <p style="font-size: 16px; color: #333;">Great news! <strong>${username}</strong> has confirmed safe arrival.</p>
        <div style="background: #d5f4e6; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Arrival Time:</strong> ${timestamp}</p>
            <p><strong>Final Location:</strong> ${formatted_address}</p>
        </div>
        <div style="text-align: center; margin: 20px 0;">
            <a href="https://maps.google.com/maps?q=${lat},${long}" 
               style="background: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                📍 View Final Location
            </a>
        </div>
        <p style="font-size: 14px; color: #666; text-align: center;">Tracking has been automatically stopped.</p>
    </div>
</body>
</html>`;

module.exports = {gmailContent, successFullVerification,mapLocation,mapLocationNearby,trackingStartTemplate,trackingLocationTemplate,safeArrivalTemplate}