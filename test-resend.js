import { Resend } from 'resend';

const resend = new Resend('re_WwWNkFUF_DX3Chmj7uvgH54Pcrv25aQwN');

async function test() {
  try {
    const data = await resend.emails.send({
      from: 'CreatorChain <notifications@creatorchain.site>',
      to: 'shuhaibs296@gmail.com',
      subject: 'Test Email from API Diagnostic',
      html: '<p>Diagnostic successful.</p>'
    });
    console.log('SUCCESS:', data);
  } catch (e) {
    console.error('ERROR:', e);
  }
}
test();
