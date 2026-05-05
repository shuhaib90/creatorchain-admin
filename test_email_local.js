import handler from './api/send-email.js';

const req = {
    method: 'POST',
    body: {
        type: 'admin_alert',
        payload: {
            project_name: "Test Project Local",
            submitted_by: "test@example.com",
            submitter_email: "test@example.com",
            submitter_telegram: "@test",
            category: "developer_bounty"
        }
    },
    headers: {}
};

const res = {
    status: (code) => {
        console.log('Status:', code);
        return res;
    },
    json: (data) => {
        console.log('JSON:', JSON.stringify(data, null, 2));
        return res;
    },
    setHeader: (name, value) => {
        console.log('Header:', name, '=', value);
        return res;
    },
    end: () => {
        console.log('End');
        return res;
    }
};

handler(req, res);
