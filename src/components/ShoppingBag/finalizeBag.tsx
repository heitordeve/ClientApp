import React from 'react';
import FunctionalityCard from '../FunctionalityCard/index';
import {
  InnerParagraph,
  InnerTiltle,
  SucessBody,
  SuccessImg,
  Linha,
  ResumeCardBox,
  QrCode,
} from './styles';
import { ShoppingBagResume } from './models';
import CheckModal from 'assets/iconCheckModal.png';
import { useAuth } from 'hooks/auth';
import { useHistory } from 'react-router-dom';
import Button from '../ui/button';
import { Column } from '../ui/layout';
import { PedidoFast } from 'dtos/Fast';
import { PATHS } from 'routes/rotas-path';
interface FinalizeBagProps {
  pedido: PedidoFast;
  resume: ShoppingBagResume;
  closeModal: () => void;
}

const FinalizeBag: React.FC<FinalizeBagProps> = ({ pedido, resume, closeModal }) => {
  const { user } = useAuth();
  const history = useHistory();
  const dadosPedido = resume.novoPedidoData;
  const isPix = dadosPedido?.Dt_pix_validade && dadosPedido?.Imagem_base64;
  const isBoleto = dadosPedido?.DataVencimento && dadosPedido?.LinhaDigitavel;
  const copyPix = () => {
    navigator.clipboard.writeText(dadosPedido.Emv);
  };
  return (
    <FunctionalityCard
      title="Compra concluida com sucesso!"
      color="#672ED7"
      components={{
        action: {
          text: '',
          startAlerting: true,
          alertText: 'Acompanhar Pedido',
          alertContent: (
            <SucessBody>
              <SuccessImg src={CheckModal} className={isPix ? 'small-img' : ''} />
              <InnerTiltle>{user.NomeUsuario} sua compra foi efetuada com sucesso!</InnerTiltle>
              {isBoleto && (
                <ResumeCardBox>
                  <div className="d-flex justify-content-center">
                    <div className="d-flex flex-shrink-0 flex-column flex-wrap">
                      <InnerParagraph className="detailsOrder">
                        Código do pedido:{' '}
                        <span className="highlight-secondary">{dadosPedido?.CodigoPedido}</span>
                      </InnerParagraph>
                    </div>
                    <Linha />
                    <div className="d-flex flex-column flex-wrap">
                      <InnerParagraph className="detailsOrder">
                        Data de vencimento do boleto:{' '}
                        <span className="highlight-secondary">{dadosPedido.DataVencimento}</span>
                      </InnerParagraph>
                      <InnerParagraph className="detailsOrder">
                        Linha digitável: {dadosPedido.LinhaDigitavel}
                        <span className="highlight-secondary"></span>
                      </InnerParagraph>
                    </div>
                  </div>
                </ResumeCardBox>
              )}
              {isPix && (
                <ResumeCardBox>
                  <Column gap="12px" align="center">
                    <InnerParagraph className="detailsOrder flex-grow-1 justify">
                      QRCode gerado com sucesso! Para concluir o pagamento, você pode ler o QRCode
                      ou copiar o código PIX Copia e Cola no botão abaixo do QRCode.
                    </InnerParagraph>
                    <Column gap="12px" align="center">
                      <QrCode src={'data:image/png;base64, ' + dadosPedido.Imagem_base64} />
                      <Button onClick={copyPix} theme="light">
                        PIX copia e cola
                      </Button>
                    </Column>
                  </Column>
                </ResumeCardBox>
              )}
              {pedido && Array.isArray(pedido.Parameters) && pedido.Parameters.length > 4 && (
                <ResumeCardBox>
                  <div className="d-flex flex-column">
                    <InnerParagraph className="detailsOrder">
                      Código do pedido:{' '}
                      <span className="highlight-secondary">{dadosPedido?.CodigoPedido}</span>
                    </InnerParagraph>
                    <InnerParagraph className="detailsOrder">
                      Valor:{' '}
                      <span className="highlight-secondary">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(pedido?.Transaction?.Price)}
                      </span>
                    </InnerParagraph>
                  </div>
                  <div className="d-flex flex-column">
                    <Linha />
                  </div>
                  <div className="d-flex flex-column flex-shrink-0">
                    <InnerParagraph className="detailsOrder">
                      Banco:{' '}
                      <span className="highlight-secondary">{pedido.Parameters[0]?.Value}</span>
                    </InnerParagraph>
                    <InnerParagraph className="detailsOrder">
                      Agência:{' '}
                      <span className="highlight-secondary">{pedido.Parameters[1]?.Value}</span>
                    </InnerParagraph>
                    <InnerParagraph className="detailsOrder">
                      Conta:{' '}
                      <span className="highlight-secondary">{pedido.Parameters[2]?.Value}</span>
                    </InnerParagraph>
                  </div>
                  <div className="d-flex flex-column">
                    <Linha />
                  </div>
                  <div className="d-flex flex-column">
                    <InnerParagraph className="detailsOrder">
                      CNPJ:{' '}
                      <span className="highlight-secondary">{pedido.Parameters[4]?.Value}</span>
                    </InnerParagraph>
                    <InnerParagraph className="detailsOrder">
                      Favorecido:{' '}
                      <span className="highlight-secondary">{pedido.Parameters[3]?.Value}</span>
                    </InnerParagraph>
                  </div>
                </ResumeCardBox>
              )}
              {!isPix && (
                <InnerTiltle className="textInformation">
                  Em caso de transferência ou depósito, anexe o comprovante na aba de pedidos.
                </InnerTiltle>
              )}
            </SucessBody>
          ),
          onClick: () => {
            history.push(PATHS.pedidos);
            closeModal();
          },
        },
      }}
    />
  );
};

export default FinalizeBag;
