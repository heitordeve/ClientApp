import React from 'react';
import FunctionalityCard from '../FunctionalityCard/index';
import {
  CardBox,
  CardBoxTail,
  InnerThumbnail,
  InnerTiltle,
  ScrollBox,
  ProductLabel,
  ProductAction,
} from './styles';
import { FiTrash } from 'react-icons/fi';
import { ShoppingBagResume } from './models';
import { HiOutlineTicket } from 'react-icons/hi';
import { FiCreditCard, FiSmartphone } from 'react-icons/fi';
import { BiReceipt, BiTv } from 'react-icons/bi';
import { ShoppingBagData } from '../../dtos/ShoppingBagData';
import { AiOutlineQrcode } from 'react-icons/ai';
import { TipoPedidoEnum } from 'enuns/tipoPedidoEnum';
import { IcPrimeiraVia, IcSegundaVia } from 'components/ui/icons';
import ResumeValue from './resumeValue';
import { P, Caption, Subhead } from 'components/ui/typography/v2';

interface bagItensProps {
  next: () => any;
  removeAndRefresh: (codigo?: number) => void;
  shoppingBag: ShoppingBagData[];
  resume: ShoppingBagResume;
}

const ICONS: { type: TipoPedidoEnum; icon: React.ReactNode }[] = [
  { type: TipoPedidoEnum.RecargaCartaoTransporte, icon: <FiCreditCard size={25} /> },
  { type: TipoPedidoEnum.QrCode, icon: <AiOutlineQrcode size={25} /> },
  { type: TipoPedidoEnum.RevalidacaoMPE, icon: <BiReceipt size={25} /> },
  { type: TipoPedidoEnum.PrimeiraVia, icon: <IcPrimeiraVia size={25} /> },
  { type: TipoPedidoEnum.SegundaVia, icon: <IcSegundaVia size={25} /> },
  { type: TipoPedidoEnum.RecargaCelular, icon: <FiSmartphone size={25} /> },
  { type: TipoPedidoEnum.ServicoDigitais, icon: <HiOutlineTicket size={25} /> },
  { type: TipoPedidoEnum.OperadoraTV, icon: <BiTv size={25} /> },
];

const BagItens: React.FC<bagItensProps> = ({ next, removeAndRefresh, shoppingBag, resume }) => {
  if (shoppingBag.length > 0) {
    return (
      <>
        <FunctionalityCard
          title="Meu Carrinho"
          color="#672ED7"
          components={{
            action: {
              text: 'Comprar agora',
              onClick: next,
            },
          }}
        >
          <InnerTiltle>Carrinho</InnerTiltle>
          <ScrollBox>
            {shoppingBag.map(element => (
              <CardBox key={element.Codigo}>
                {element.IconeUrl ? (
                  <InnerThumbnail>
                    <img src={element.IconeUrl} alt={'logo ' + element.Nome} />
                  </InnerThumbnail>
                ) : (
                  <InnerThumbnail color="#672ed7">
                    {ICONS.find(i => i.type === element.TipoPedido).icon}
                  </InnerThumbnail>
                )}
                <ProductLabel>
                  <Subhead size="B">{element.Nome}</Subhead>
                  <P>{element.Detalhes}</P>
                  {element.NumeroCartao && (
                    <Caption color="primary">{element.NumeroCartao}</Caption>
                  )}
                  <div>
                    <ProductAction
                      type="button"
                      onClick={() => {
                        removeAndRefresh(element.Codigo);
                      }}
                    >
                      <FiTrash />
                      <p>Excluir</p>
                    </ProductAction>
                  </div>
                </ProductLabel>
                <CardBoxTail>
                  <Subhead size="B">{element.ValorRecarga.toMoneyString()}</Subhead>
                </CardBoxTail>
              </CardBox>
            ))}
          </ScrollBox>
          <ResumeValue resume={resume} />
        </FunctionalityCard>
      </>
    );
  } else {
    return (
      <>
        <FunctionalityCard title="Meu Carrinho" color="#672ED7">
          <InnerTiltle>Nenhum item no carrinho no momento</InnerTiltle>
        </FunctionalityCard>
      </>
    );
  }
};

export default BagItens;
