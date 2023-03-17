import React, { useEffect, useState, useCallback } from 'react';

import { Caption, Title, P } from 'components/ui/typography/v2';
import { ItemCard } from 'components/ui/card';
import { PostoAtendimentoApi, EstadoApi } from 'services/apis';
import { useVias } from './viasHook';
import { useLoad } from 'hooks';
import { PostoDeAtendimento } from 'dtos/postoDeAtendimento';
import { Column } from 'components/ui/layout';
import { RedetiradaDto } from 'dtos/Pedidos';
import { EFormaDeEntrega } from 'enuns/formaDeEntrega';

const LOAD = 'postosDeAtendimento';
const MetodoRetirada: React.FC = () => {
  const [postos, setPostos] = useState<PostoDeAtendimento[]>([]);
  const { onNext, codigoOperadora, setFormaDeEntrega, setPostoDeAtendimento, via } = useVias();
  const { addLoad, removeLoad } = useLoad();

  const onSelect = useCallback(
    (posto: PostoDeAtendimento) => {
      setPostoDeAtendimento(posto);
      setFormaDeEntrega({ Tipo: EFormaDeEntrega.Retirada, IdPosto: posto.Id } as RedetiradaDto);
      onNext();
    },
    [onNext, setPostoDeAtendimento, setFormaDeEntrega],
  );

  useEffect(() => {
    if (codigoOperadora) {
      (async () => {
        addLoad(LOAD);
        let tmpPostos = await PostoAtendimentoApi.Listar(codigoOperadora);
        let estados = await EstadoApi.Listar();
        tmpPostos.forEach(p => {
          p.Endereco.Estado = estados.find(e => e.Id === p.Endereco.Estado.Id);
        });
        setPostos(tmpPostos);
        removeLoad(LOAD);
      })();
    }
  }, [codigoOperadora, addLoad, removeLoad]);

  return (
    <Column gap="12px">
      <P>Selecione o posto de atendimento no qual deseja coletar a {via}ª via do seu cartão:</P>
      {postos?.map(p => (
        <ItemCard key={p.Id} onClick={() => onSelect(p)}>
          <Title color="primary">{p.Nome}</Title>
          <Column>
            <Caption>{p.Endereco.Logradouro}</Caption>
            <Caption>Nº {p.Endereco.Numero}</Caption>
            <Caption>{p.Endereco.Bairro}</Caption>
            <Caption>
              {p.Endereco.Cidade}/{p.Endereco.Estado.Sigla}
            </Caption>
            <Caption>CEP: {p.Endereco.Cep}</Caption>
            <Caption>{p.Telefone}</Caption>
          </Column>
        </ItemCard>
      ))}
    </Column>
  );
};

export default MetodoRetirada;
