// Confere na App Store Connect se o build enviado chegou de verdade (o envio
// às vezes termina "com sucesso" sem nada chegar na Apple). Só leitura.
// Uso: node asc-upload-status.js <buildNumber>
// Variáveis: ASC_KEY_ID, ASC_ISSUER_ID, KEY (caminho do .p8), ASC_APP_ID
// Saída: 0 = chegou; 1 = chegou com erro; 2 = não chegou em 10 minutos
const crypto = require("crypto");
const fs = require("fs");

const version = process.argv[2];
const { ASC_KEY_ID, ASC_ISSUER_ID, KEY, ASC_APP_ID } = process.env;
const b64url = (b) => Buffer.from(b).toString("base64url");

const token = () => {
	const now = Math.floor(Date.now() / 1000);
	const h = b64url(JSON.stringify({ alg: "ES256", kid: ASC_KEY_ID, typ: "JWT" }));
	const p = b64url(
		JSON.stringify({ iss: ASC_ISSUER_ID, iat: now, exp: now + 900, aud: "appstoreconnect-v1" }),
	);
	const sig = crypto.sign("sha256", Buffer.from(`${h}.${p}`), {
		key: fs.readFileSync(KEY),
		dsaEncoding: "ieee-p1363",
	});
	return `${h}.${p}.${b64url(sig)}`;
};

const findUpload = async () => {
	const url = `https://api.appstoreconnect.apple.com/v1/apps/${ASC_APP_ID}/buildUploads?limit=200`;
	const res = await fetch(url, { headers: { Authorization: `Bearer ${token()}` } });
	if (!res.ok) return null;
	const json = await res.json();
	return json.data.find((d) => d.attributes.cfBundleVersion === version) ?? null;
};

(async () => {
	for (let i = 0; i < 20; i += 1) {
		const up = await findUpload().catch(() => null);
		if (up) {
			const state = up.attributes.state;
			console.log(`Build ${version} na Apple: ${JSON.stringify(state)}`);
			process.exit(state.errors.length > 0 || state.state === "FAILED" ? 1 : 0);
		}
		await new Promise((r) => setTimeout(r, 30000));
	}
	console.log(`Build ${version} não apareceu na App Store Connect`);
	process.exit(2);
})();
