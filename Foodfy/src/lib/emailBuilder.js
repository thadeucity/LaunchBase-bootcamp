
// ----------------  COMPANY INFO  ---------------- //

const companyName = 'Foodfy';
const companyUrl = 'http://localhost:3000';

const firstLoginPath = '/admin';

const supportEmail = 'support@foodfy.com';

const primaryColor = '#6558C3';
const cardColor = '#F2F2F2';

// ----------------  HEADER IMAGE  ---------------- //

const logoSrc = 'https://raw.githubusercontent.com/Rocketseat/bootcamp-launchbase-desafios-02/master/layouts/assets/logo.png';
const logo = `
  <div style="text-align: center">
    <img src="${logoSrc}" alt="${companyName}-logo">
  </div>
`;

// ----------------  EMAIL STYLING  ---------------- //

const cardStyle = `style="
  text-align: left;
  margin: 0 auto;
  max-width:500px;
  background-color: ${cardColor};
  padding: 24px 16px;
  border-radius:8px;
"`;

const buttonStyle = `style="
  display: block;
  background-color: ${primaryColor};
  width:50%;
  text-align: center;
  padding: 8px;
  border-radius:8px;
  margin-top: 24px;
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-family:sans-serif
"`;

const h2Style = `style="
  font-size: 20px;
  font-family:sans-serif
"`;

const textStyle = `style="
  font-size: 14px;
  font-family:sans-serif
"`;

// ----------------  PARTS BUILDER  ---------------- //

function writeGreeting (name, lang){
  let greeting = '';
  if (lang == 'pt'){
    greeting = `<h2 ${h2Style}>Olá, ${name}</h2>`;
  } else{
    greeting = `<h2 ${h2Style}>Hello, ${name}</h2>`;
  }
  return greeting;
}

function createButton (path, text){
  return `<a href="${path}" target="_blank" ${buttonStyle}>${text}</a>`;
}

function createParagraphs (textArray){
  let paragraphs = ``;
  for (let text of textArray){
    paragraphs = `${paragraphs}
      <p ${textStyle}>${text}</p>
    `;
  }
  return paragraphs;
}

// ----------------  EMAIL CREATOR  ---------------- //

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
        ${writeGreeting(content.username, content.lang)}
        ${createParagraphs(content.text)}

  `;

  if (content.buttonText){
    emailHtml = `${emailHtml}
      ${createButton(content.buttonPath, content.buttonText)}
    `;
  }

  emailHtml = `${emailHtml}
        </div>
      </BODY>
    </HTML>
  `;

  return emailHtml;
}

// --------  EMAIL ONLY TEXT CREATOR  -------- //

function createEmailText(content){
  let emailText = '';

  if(content.lang == 'pt'){
    emailText = `Olá ${content.username}`;
  } else{
    emailText = `Hello ${content.username}`;
  }

  for (let text of content.text){
    emailText = `${emailText}
    ${text}
    `;
  }

  if (content.buttonText){
    emailText = `${emailText}
      ${content.buttonText},
      ${content.buttonPath}
    `;
  }

  return emailText;
}

// ----------------  EXPORTABLE TEMPLATES  ---------------- //

function welcomeEmail(type, name, password, lang){
  const emailContent = {
    username: name,
    buttonPath: `${companyUrl}${firstLoginPath}`,
  }

  if (lang == 'pt'){
    emailContent.lang = 'pt';
    emailContent.text = [
      `Seu cadastro no ${companyName} foi efetuado com sucesso!`,
      `Sua senha temporária é <b>${password}</b> durante seu primeiro acesso
        solicitaremos que altere sua senha para validar sua conta`
    ];
    emailContent.buttonText = 'ACESSE SUA CONTA';
  } else {
    emailContent.text = [
      `Your registration at ${companyName} is almost complete!`,
      `Your temporary password is <b>${password}</b> during you first access
        we will ask you to change your password to validate your account`
    ];
    emailContent.buttonText = 'VALIDATE ACCOUNT';
  }

  if (type == 'html'){
    return createEmail(emailContent);
  } else{
    emailContent.text[1].replace(/"[<]b[>]"/g, '');
    return createEmailText(emailContent);
  }

  
}

function forgotPasswordEmail(name, token, lang){
  const emailContent = {
    username: name,
    buttonPath: `${companyUrl}${firstLoginPath}?${token}`,
  }

  if (lang == 'pt'){
    emailContent.text = [
      `Verificamos que você esqueceu sua senha, não há problema clique no link
        abaixo e te redirecionaremos para uma página de recuperação de senha.`,
      `Caso não tenha sido você que realizou a solicitação de recuperação de senha,
        por favor entre em contato conosco o mais rapidamente possível para que
        possamos solucionar o problema.`,
      `Nosso email para suporte é: ${supportEmail}`
    ];
    emailContent.buttonText = 'RECUPERE SUA SENHA';
  } else {
    emailContent.text = [
      `We noticed you forgot your password, don't worry click the link bellow and
        we will redirect you to a password revery page`,
      `In case you were not the one asking for the password recovery, please 
        contact us as soon as possible so we can solve this issue.`,
      `Our support email for contact is ${supportEmail}`
    ];
    emailContent.buttonText = 'RECOVER PASSWORD';
  }
  

  return createEmail(emailContent);
}


module.exports = {
  welcomeEmail,
  forgotPasswordEmail
}