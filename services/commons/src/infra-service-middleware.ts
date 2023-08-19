const INFRA_SERVICES_SECRET = process.env['INFRA_SERVICES_SECRET'] || 'secret'

export function infraServiceMiddleware(req: any, res: any, next: any): void {
  console.log('Infra service middleware')
  const header = req.headers['infra-services-secret']
  if (header !== INFRA_SERVICES_SECRET) {
    res.status(403).send('Forbidden, this is an infra service endpoint')
    return
  }
  next()
}
