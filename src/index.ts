/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	AI: Ai;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === 'GET') {
			const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pokémon Fusion Generator</title>
        </head>
        <body>
          <h1>Pokémon Fusion Generator</h1>
          <form action="/" method="POST">
            <label for="pokemon1">Pokémon 1:</label>
            <input type="text" id="pokemon1" name="pokemon1" required><br><br>

            <label for="pokemon2">Pokémon 2:</label>
            <input type="text" id="pokemon2" name="pokemon2" required><br><br>

            <input type="submit" value="Generate Pokémon">
          </form>
        </body>
        </html>
      `;
			return new Response(html, {
				headers: { 'Content-Type': 'text/html' },
			});
		}

		if (request.method === 'POST') {
			const formData = await request.formData();
			const pokemon1 = formData.get('pokemon1') as string;
			const pokemon2 = formData.get('pokemon2') as string;

			const prompt = `Combine ${pokemon1} and ${pokemon2} into a single, unique Pokémon. This new creature should have a blended appearance that incorporates key features, colors, and traits from both original Pokémon. The resulting design should be a seamless fusion, retaining recognizable elements from each, while also introducing new characteristics that reflect the merged identity.`;

			const inputs = {
				prompt,
			};

			const response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', inputs);

			return new Response(response, {
				headers: {
					'content-type': 'image/png',
				},
			});
		}

		return new Response('Invalid request method', { status: 405 });
	},
} satisfies ExportedHandler<Env>;
