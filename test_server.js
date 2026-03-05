import fetch from 'node-fetch';

async function test() {
    try {
        const res = await fetch('http://localhost:3001/api/settings/site/hero', {
            method: 'POST'
        });
        console.log(res.status, await res.text());
    } catch (e) {
        console.error(e);
    }
}
test();
