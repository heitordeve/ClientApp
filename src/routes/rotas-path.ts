export const PATHS = {
  principal: '/',
  beneficios: '/beneficios ',
  cadastro: '/cadastro',
  carteiraDigital: '/carteira-digital',
  cartoesDeCredito: '/credit-card',
  conteudosDigitais: '/digital-content',
  conveniencias: '/conveniencias',
  dashboard: '/dashboard',
  esqueciSenha: '/esqueci-minha-senha',
  faq: '/faq',
  mapa: '/mapa',
  pedidos: '/pedidos',
  perfil: '/perfil',
  recuperarSenha: '/recuperarSenha/:token',
  sac: '/sac',
  shopping: '/Shopping',
  termosDeUso: '/terms-of-use',
  transporte: {
    url: '/transporte',
    get agendamento() {
      return this.url + '/agendamento';
    },
    get recarga() {
      return this.url + '/recarga';
    },
    qrcode: '/transporte/qrcode',
    primeiraVia: '/transporte/via/primeira',
    segundaVia: '/transporte/via/segunda',
  },
};
