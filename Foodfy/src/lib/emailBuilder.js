// ------------------------    COMPANY INFO    ------------------------ //

const companyName = 'Foodfy';
const companyUrl = 'http://localhost:3000';

const firstLoginPath = '/admin/login';
const resetPasswordPath = '/admin/reset-password';

const supportEmail = 'support@foodfy.com';

const address = '1234 Some Street, San Francisco, CA';

const primaryColor = '#6558C3';
const cardColor = '#F2F2F2';

// ------------------------    HEADER IMAGE    ------------------------ //

const logoSrc = 'https://raw.githubusercontent.com/Rocketseat/bootcamp-launchbase-desafios-02/master/layouts/assets/logo.png';
const logo = `
  <div style="text-align: center">
    <img src="${logoSrc}" alt="${companyName}-logo">
  </div>
`;

// ------------------------    EMAIL STYLING    ------------------------ //

const cardStyle = `style="
  text-align: left;
  margin: 0 auto;
  max-width: 450px;
  background-color: ${cardColor};
  padding: 24px 16px;
  border-radius:8px;
"`;

const infoStyle = `style="
  text-align: center;
"`;

const buttonStyle = `style="
  display: block;
  background-color: ${primaryColor};
  width:50%;
  text-align: center;
  padding: 8px;
  border-radius:8px;
  margin: 24px auto;
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-family:sans-serif;
"`;

const h2Style = `style="
  font-size: 20px;
  font-family:sans-serif;
"`;

const textStyle = `style="
  font-size: 14px;
  font-family:sans-serif;
"`;

const noteStyle = `style="
font-size: 12px;
color: #444444;
font-family:sans-serif;
overflow-wrap: break-word;
"`;

const infoTextStyle = `style="
  font-size: 12px;
  color: #999999;
  font-family:sans-serif;
"`;

// ------------------------    CREATE PARTS    ------------------------ //

function createLink (path, text){
  return `<a href="${path}">${text}</a>`;
}

function createParagraphs (textArray, type){
  let paragraphs = ``;
  let style = ``;

  switch (type){
    case 'text':
      style = textStyle;
      break;
    case 'note':
      style = noteStyle;
      break;
    case 'info':
      style = infoTextStyle;
  }

  for (let text of textArray){
    paragraphs = `${paragraphs}
      <p ${style}>${text}</p>
    `;
  }
  return paragraphs;
}


function createButton (path, text){
  return `<a href="${path}" target="_blank" ${buttonStyle}>${text}</a>`;
}

// ------------------------    EMAIL BUILDER    ------------------------ //

function createEmail(content){
  let emailHtml = `
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
    <HTML>
      <HEAD>
        <META http-equiv=Content-Type content="text/html; charset=utf-8">
      </HEAD>
      <BODY>
        <div ${cardStyle}>
        ${logo}
        <h2 ${h2Style}>${content.greeting}</h2>
        ${createParagraphs(content.text, 'text')}

  `;

  if (content.buttonText){
    emailHtml = `${emailHtml}
      ${createButton(content.buttonPath, content.buttonText)}
    `;
  }

  if (content.appendText){
    emailHtml = `${emailHtml}
      ${createParagraphs(content.appendText, 'text')}
    `;
  }

  if (content.noteText){
    emailHtml = `${emailHtml}
      ${createParagraphs(content.noteText, 'note')}
    `;
  }

  emailHtml = `${emailHtml}
        </div>
        <div ${infoStyle}>
          ${createParagraphs(content.info, 'info')}
        </div>
      </BODY>
    </HTML>
  `;

  return emailHtml;
}

// ------------------------    TEXT ONLY BUILDER    ------------------------ //

function createTextOnly(content){
  let emailText = `${content.greeting}`;

  for (let text of content.textOnly){
    emailText = `${emailText}
      ${text}`
    ;
  }

  return emailText;

}

// ------------------------    TEXT BY LANGUAGE    ------------------------ //

const textPortuguese = {
  info: [ 
    `© 2020 ${companyName}. Todos os direitos reservados.`,
    `${companyName}, ${address}`
  ],
  greeting(name){
    return `Olá, ${name}`;
  }
};

const textEnglish = {
  info: [ 
    `© 2020 ${companyName}. All rights reserved.`,
    `${companyName}, ${address}`
  ],
  greeting(name){
    return `Hello, ${name}`;
  }
};

// ------------------------    EXPORT BUILDERS    ------------------------ //

function welcomeEmail(data){
  const emailContent = {
    buttonPath: `${companyUrl}${firstLoginPath}`,
  }

  if (data.language == 'pt'){
    emailContent.info = textPortuguese.info;

    emailContent.greeting = textPortuguese.greeting(data.name);

    emailContent.text = [
      `Seu cadastro no ${companyName} foi efetuado com sucesso, estamos muito 
        felizes por ter você conosco!`,
      `Use a senha temporária <b>${data.password}</b> para acessar sua conta pela
        primeira vez.`,
      `Ao acessá-la solicitaremos que altere sua senha para que possamos 
        validar sua conta.`,
      `Caso tenha qualquer dúvida sinta-se à vontade para nos enviar um 
        ${createLink(supportEmail,'email')}.`
    ];

    emailContent.buttonText = `ACESSAR MINHA CONTA`;

    emailContent.appendText = [
      `Caso tenha qualquer problema em acessar o link acima você pode copiar e 
        colar o seguinte endereço em seu navegador: ${companyUrl}${firstLoginPath}`
    ];

    emailContent.textOnly = [
      `Seu cadastro no ${companyName} foi efetuado com sucesso, estamos muito felizes por ter você conosco!`,
      `Use a senha temporária ${data.password} para acessar sua conta pela primeira vez.`,
      `Ao acessá-la solicitaremos que altere sua senha para que possamos validar sua conta.`,
      `Acesse sua conta pelo link ${companyUrl}${firstLoginPath}`,
      `Quaisquer dúvidas sinta-se a vontade para nos enviar um email: ${supportEmail}`
    ];

  } else {
    emailContent.info = textEnglish.info;

    emailContent.greeting = textEnglish.greeting(data.name);

    emailContent.text = [
      `You are successfully registered, We’re thrilled to have you on board at ${companyName} with us.`,
      `Use yur temporary password <b>${data.password}</b> to access your account for the first time.`,
      `During your first login we will ask you to change your password to validate your account.`,
      `Fell free to contact us by ${createLink(supportEmail,'email')} for any questions you might have.`
    ];

    emailContent.buttonText = `ACCESS MY ACCOUNT`;

    emailContent.appendText = [
      `If you’re having trouble with the button above,
        copy and paste the URL below into your web browser.`,
      `${companyUrl}${firstLoginPath}`
    ];

    emailContent.textOnly = [
      `You were successfully registered, We’re thrilled to have you on board.`,
      `Use yur temporary password ${data.password} to access your account for the first time.`,
      `During your first login we will ask you to change your password to validate your account.`,
      `Access your account with the following link ${companyUrl}${firstLoginPath}.`,
      `Fell free to contact us for any questions you might have: ${supportEmail}`
    ];

  }

  if (data.textOnly){
    return createTextOnly(emailContent);
  } else {
    return createEmail(emailContent);
  }
}

function resetPasswordEmail(data){
  const emailContent = {
    buttonPath: `${companyUrl}${resetPasswordPath}?email=${data.email}&token=${data.token}`,
  }

  emailContent.info = textEnglish.info;
  emailContent.greeting = textEnglish.greeting(data.name);

  emailContent.text = [
    `You recently requested to reset your password for your ${companyName} account.
      Use the button below to reset it. <b>This password reset is only valid for the next hour.</b>`,
  ];

  emailContent.buttonText = `RESET YOUR PASSWORD`;

  emailContent.appendText = [
    `For security, if you did not request a password reset, please ignore this
      email or ${createLink(supportEmail,'contact support')} if you have questions.`,
  ];

  emailContent.noteText = [
    `</br> If you’re having trouble with the button above, copy and paste
      the URL below into your web browser.`,
    `${companyUrl}${resetPasswordPath}?email=${data.email}&token=${data.token}`
  ]

  emailContent.textOnly = [
    `You recently requested to reset your password for your ${companyName} account.`,
    `Copy and paste the URL below into your web browser to reset your password.`,
    `${companyUrl}${resetPasswordPath}?email=${data.email}&token=${data.token}`,
    `This password reset is only valid for the next hour.`,
    `If you did not request a password reset, please ignore this email or contact support if you have questions. ${supportEmail}`
  ];

  if (data.textOnly){
    return createTextOnly(emailContent);
  } else {
    return createEmail(emailContent);
  }
}

module.exports = {
  welcomeEmail,
  resetPasswordEmail
}