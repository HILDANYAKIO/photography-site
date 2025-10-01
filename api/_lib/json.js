export function ok(res, data) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify(data));
}

export function created(res, data) {
  res.setHeader('Content-Type', 'application/json');
  res.status(201).end(JSON.stringify(data));
}

export function badRequest(res, message = 'Bad Request') {
  res.setHeader('Content-Type', 'application/json');
  res.status(400).end(JSON.stringify({ error: message }));
}

export function methodNotAllowed(res) {
  res.setHeader('Allow', 'GET,POST');
  res.status(405).end('Method Not Allowed');
}


