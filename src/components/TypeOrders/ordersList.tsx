import React, { useState, useCallback, useEffect, useRef } from 'react';

import { Card } from '../ui/card';
import { BodySpan } from '../ui/typography';
import { Column } from '../ui/layout';
import { LoadMini } from '../ui/loading';

import { PedidoResumido } from '../../dtos/Pedidos';
import TabSelector from '../ui/tabSelector';
import PedidoApi from '../../services/apis/pedidoApi';
import { groupBy } from '../../utils/Array';

import OrdersResumed from './ordersResumed';
import NoOrders from './noOrders';

interface OrdersListProps {
  onOpen: (id: number) => void;
  onClickComprovante?: (id: number) => void;
}

class Page {
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.countLoads = 0;
    this.canLoad = true;
  }

  id: number;
  name: string;
  countLoads: number;
  canLoad: boolean;
}
//const paginas = [new Page(1, 'Pendentes'), new Page(2, 'Finalizados')];

const OrdersList: React.FC<OrdersListProps> = ({ onOpen, onClickComprovante }) => {
  const refLoad = useRef<HTMLInputElement>(null);
  const [paginas] = useState<Page[]>([new Page(1, 'Pendentes'), new Page(2, 'Finalizados')]);

  const [tabAtual, setTabAtual] = useState<number>(1);
  const [pedidos, setPedidos] = useState<PedidoResumido[]>([]);
  const [isloading, setIsloading] = useState<boolean>(true);

  const refresh = useCallback(() => {
    setPedidos([]);
    paginas.forEach(p => {
      p.countLoads = 0;
      p.canLoad = true;
    });
  }, [paginas]);

  const getPage = useCallback((id: number): Page => paginas.find(p => p.id === id), [paginas]);

  const buscar = useCallback(async () => {
    const pagina = getPage(tabAtual);
    if (pagina.canLoad) {
      setIsloading(true);
      const novosPedidos = await PedidoApi.Listar(pagina.id, pagina.countLoads);
      pagina.countLoads++;
      if (novosPedidos.length === 0) {
        pagina.canLoad = false;
      }
      const tmpPedidosAnteriores = pedidos.filter(
        p => !novosPedidos.some(pn => pn.CodigoPedido === p.CodigoPedido),
      );
      setPedidos([...tmpPedidosAnteriores, ...novosPedidos]);
      setIsloading(false);
    }
  }, [pedidos, tabAtual, getPage]);

  const goToTab = useCallback((id: number) => setTabAtual(id), []);

  window.onscroll = () => {
    if (
      !isloading &&
      window.innerHeight + window.scrollY >=
        (refLoad?.current?.offsetTop ?? document.body.offsetHeight)
    ) {
      buscar();
    }
  };

  useEffect(() => {
    if (getPage(tabAtual).countLoads === 0) {
      buscar();
    }
  }, [tabAtual, buscar,getPage]);

  const filtred = pedidos.filter(p => p.CodigoStatusPedido === tabAtual);
  const hasPedidos = filtred.length === 0;
  return (
    <Column gap="8px">
      <Column grow={0}>
        <TabSelector
          tabs={paginas.map(tab => {
            return { id: tab.id, name: tab.name };
          })}
          selectedId={tabAtual}
          onClick={goToTab}
        />
      </Column>
      <Column>
        <Card className="column">
          {groupBy(filtred, p => p.DataPedido).map(({ key, value }) => (
            <div key={key}>
              <BodySpan className="strong">{key}</BodySpan>
              {value.map(pedido => (
                <OrdersResumed
                  key={pedido.CodigoPedido}
                  pedido={pedido}
                  onOpen={id => onOpen(id)}
                  onChange={id => refresh()}
                />
              ))}
            </div>
          ))}
          {hasPedidos && !isloading && <NoOrders />}
          <div ref={refLoad}>
            <LoadMini loading={isloading} timeout={60} />
          </div>
        </Card>
      </Column>
    </Column>
  );
};

export default OrdersList;
