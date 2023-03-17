
export interface PedidoFast {
  Parameters: {
    Value: {
      Id: string
      Name: string
      Value: string
    };
  }[]

  Transaction: {
    BankSlip: string
    Custom: string
    ItemDescription: string
    PaymentMethod: number
    Pid: number
    Price: number
    ProdId: number
    Status: number
    StatusName: string
    SubPaymentMethod: number
    Tid: string
  }
  Validation: {
    ValidationCode1: string
    ValidationCode2: string
    ValidationCode3: string
    ValidationCode4: string
  }
}


export interface ValidacaoComprovanteRequest {
  AmountPaid: number
  Base64Image: string
  Base64ImageExtension: string
  PaymentTime: Date
  Pid: number
  Tid: string
  ValidationCode1: string
  ValidationCode2: string
  ValidationCode3: string
  ValidationCode4: string
}
export interface FastGateway {
  CodigoGateway: number
  NomeGateway: string
  ParametrosFastCash: { tid: string, pid: number, prodid: number }
  SiteGateway: string
  SiteGatewayRecurring: string
  TokenAutorizacaoGateway: string
}
