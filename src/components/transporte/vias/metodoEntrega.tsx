import React from 'react';

import { Title } from 'components/ui/typography/v2';
import { CartaoTransporteApi } from 'services/apis';
import { Column } from 'components/ui/layout';

import { useVias } from './viasHook';
import FormEndereco from 'components/formularios/enderecoForm';
import { Endereco } from 'dtos/endereco';
import { EFormaDeEntrega } from 'enuns/formaDeEntrega';
import { EntregaDto } from 'dtos/Pedidos';
import { useLoad } from 'hooks';

const MetodoEntrega: React.FC = () => {
  const { onNext, setFormaDeEntrega, formaDeEntrega, tipoCartao } = useVias();
  const { addLoad, removeLoad } = useLoad();

  const handleChangeEndereco = async (endereco: Endereco) => {
    const LOAD = 'CalcTaxa';
    addLoad(LOAD);
    const taxa = await CartaoTransporteApi.CalcularTaxaEntregaVias({
      IdTipoCartao: tipoCartao.Codigo,
      Endereco: endereco,
    });
    removeLoad(LOAD);
    if (taxa) {
      setFormaDeEntrega({
        Tipo: EFormaDeEntrega.Entrega,
        Endereco: endereco,
        Valor: taxa,
      } as EntregaDto);
      onNext();
    }
  };

  return (
    <>
      <Column gap="6px" flex="1">
        <Title align="center" size="SB">
          Informe o endereço no qual deseja receber sua primeira via de cartão.
        </Title>
        <FormEndereco
          endereco={(formaDeEntrega as EntregaDto).Endereco}
          onChange={handleChangeEndereco}
          submitLable="Proximo"
        />
      </Column>
    </>
  );
};

export default MetodoEntrega;
