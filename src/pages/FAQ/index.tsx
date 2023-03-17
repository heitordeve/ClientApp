import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { decode } from 'html-entities';

import { AccordionProvider } from './accordionProvider';
import FaqGroup from './faq-grupo';

import { IcLike, IcDislike, IcSearch } from 'components/ui/icons';
import Input from 'components/ui/input/v2';
import { Headline, Caption, Title } from 'components/ui/typography/v2';
import { Column, Row } from 'components/ui/layout';
import { FaqCategoria } from 'dtos/faq';
import { useLoad } from 'hooks';
import { FaqApi } from 'services/apis';
import { Fab } from 'components/ui/button';
import { Form } from 'components/ui/form';

const Faq: React.FC = () => {
  const { addLoad, removeLoad } = useLoad();
  const [grupos, setGrupos] = useState<FaqCategoria[]>([]);
  const [filtro, setFiltro] = useState<string>('');

  const avaliar = useCallback(
    async (id: number, isCurtir: boolean) => {
      const LOAD = 'FaqAvaliar';
      addLoad(LOAD);
      await FaqApi.Avaliar(id, isCurtir);
      removeLoad(LOAD);
    },
    [addLoad, removeLoad],
  );

  const CarregarPerguntas = useCallback(async () => {
    const LOAD = 'FaqListar';
    addLoad(LOAD);
    const lista = await FaqApi.Listar();
    lista.forEach((g, i) => (g.id = i));
    setGrupos(lista);
    removeLoad(LOAD);
  }, [addLoad, removeLoad, setGrupos]);

  useEffect(() => {
    CarregarPerguntas();
  }, [CarregarPerguntas]);

  const filtrado = useMemo(
    () =>
      grupos
        .filter(
          g =>
            !filtro ||
            g.Titulo.includes(filtro) ||
            g.Perguntas.some(p => p.Titulo.includes(filtro) || p.Resposta.includes(filtro)),
        )
        .map(g => ({
          ...g,
          Perguntas: g.Titulo.includes(filtro)
            ? g.Perguntas
            : g.Perguntas.filter(p => p.Titulo.includes(filtro) || p.Resposta.includes(filtro)),
        })),
    [filtro, grupos],
  );
  const nadaEncontrado = useMemo(
    () => filtro.length > 0 && filtrado.length === 0,
    [filtro.length, filtrado.length],
  );
  return (
    <Column padding="24px" smPadding="24px 0" align="center" gap="16px">
      <Row justify="center" width="100%;">
        <Headline size="B" color="primary">
          Perguntas Frequentes
        </Headline>
      </Row>
      <Column maxWidth="750px" width="100%" align="center" gap="16px">
        <Form onSubmit={() => {}}>
          <Row>
            <Input
              name="PalavraChave"
              placeholder="O que está procurando hoje?"
              rigthIcon={IcSearch}
              onChange={e => setFiltro(e.target.value)}
              round
            />
          </Row>
        </Form>
        <AccordionProvider round>
          {filtrado.map(e => (
            <FaqGroup key={e.id} id={e.id} title={e.Titulo} color="primary" background="gray-1">
              <AccordionProvider>
                {e.Perguntas.map(p => (
                  <FaqGroup
                    key={p.Id}
                    id={p.Id}
                    title={decode(p.Titulo.replace(/<\/?[^>]+(>|$)/g, ''))}
                  >
                    <Column width="100%">
                      <Row padding="12px" background="gray-2">
                        <div dangerouslySetInnerHTML={{ __html: p.Resposta }} />
                      </Row>
                      <Column align="center" gap="6px" padding="6px">
                        <Caption size="B">Esta resposta foi útil?</Caption>
                        <Row gap="6px">
                          <Fab size={48} onClick={() => avaliar(p.Id, true)}>
                            <IcLike />
                          </Fab>
                          <Fab size={48} onClick={() => avaliar(p.Id, false)}>
                            <IcDislike />
                          </Fab>
                        </Row>
                      </Column>
                    </Column>
                  </FaqGroup>
                ))}
              </AccordionProvider>
            </FaqGroup>
          ))}
        </AccordionProvider>
        {nadaEncontrado && <Title>Nada encontrado!</Title>}
      </Column>
    </Column>
  );
};

export default Faq;
