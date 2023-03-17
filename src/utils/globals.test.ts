describe('Globals', () => {
  describe('Number', () => {

    describe('toDecimalString', () => {
      it('Deve converter 1.23 para "1,23"', () => {
        const resultado = 1.23.toDecimalString()
        expect(resultado).toEqual('1,23')
      })
      it('Deve converter 1_111.23 para "1.111,23"', () => {
        const resultado = 1_111.23.toDecimalString()
        expect(resultado).toEqual('1.111,23')
      })
      it('Deve converter 1 para "1,00"', () => {
        const resultado = (1).toDecimalString()
        expect(resultado).toEqual('1,00')
      })
    })

    describe('between', () => {
      it('1 deve estar entre 0 e 2', () => {
        const resultado = (1).between(0, 2)
        expect(resultado).toBe(true);
      })
      it('1 deve estar entre 0 e 1', () => {
        const resultado = (1).between(0, 1)
        expect(resultado).toBe(true);
      })
      it('2 não deve estar entre 0 e 1', () => {
        const resultado = (2).between(0, 1)
        expect(resultado).toBe(false);
      })
      it('0 não deve estar entre 1 e 2', () => {
        const resultado = (0).between(1, 2)
        expect(resultado).toBe(false);
      })
      it('0 não deve estar entre 2 e 1', () => {
        const resultado = (0).between(2, 1)
        expect(resultado).toBe(false);
      })
    })
  })
  describe('Array', () => {
    describe('remove', () => {
      it('Deve remover o 2', () => {
        const resultado = [1, 2, 3].remove(x => x === 2);
        expect(resultado).toContain(1);
        expect(resultado).not.toContain(2);
        expect(resultado).toContain(3);
      })
      it('Deve remover com id === 2', () => {
        const obj1 = { id: 1 };
        const obj2 = { id: 2 };
        const obj3 = { id: 3 };
        const resultado = [obj1, obj2, obj3].remove(x => x.id === 2);
        expect(resultado).toContain(obj1);
        expect(resultado).not.toContain(obj2);
        expect(resultado).toContain(obj3);
      })
    })
    describe('group', () => {
      it('Deve agrupar pelo tipo', () => {
        const obj1 = { id: 1, tipo: 1 };
        const obj2 = { id: 2, tipo: 1 };
        const obj3 = { id: 3, tipo: 2 };
        const resultado = [obj1, obj2, obj3].group(x => x.tipo);
        expect(resultado.get(1).length).toBe(2);
        expect(resultado.get(2).length).toBe(1);
        expect(resultado.get(3).length).toBe(0);
        expect(resultado.length).toBe(2);
      })
      it('Deve agrupar array vazio', () => {
        const resultado = [].group(x => x.tipo);
        expect(resultado.length).toBe(0);
      })
    })
    describe('order', () => {
      it('Deve ordenar Number', () => {
        const arr = [3, 7, 1];
        const resultado = arr.order();
        expect(resultado[0]).toBe(1);
        expect(resultado[1]).toBe(3);
        expect(resultado[2]).toBe(7);
      })
      it('Deve ordenar String', () => {
        const arr = ['3', '7', '7', '1'];
        const resultado = arr.order();
        expect(resultado[0]).toBe('1');
        expect(resultado[1]).toBe('3');
        expect(resultado[2]).toBe('7');
        expect(resultado[3]).toBe('7');
      })
      it('Deve ordenar pela propiedade do objeto', () => {
        const arr = [{ a: '3' }, { a: '7' }, { a: '1' }];
        const resultado = arr.order(x => x.a);
        expect(resultado[0].a).toBe('1');
        expect(resultado[1].a).toBe('3');
        expect(resultado[2].a).toBe('7');
      })
    })

  })
  describe('String', () => {
    describe('ToNumber', () => {
      it('"1" deve converter para 1', () => {
        const resultado = "1".ToNumber();
        expect(resultado).toBe(1);
      })
      it('""1a" deve converter para NaN', () => {
        const resultado = "1a".ToNumber();
        expect(resultado).toBe(NaN);
      })
    })
    describe('isIsoDateFormat', () => {
      it('"2021-01-01T03:00:00.000Z" deve ser true', () => {
        const resultado = "2021-01-01T03:00:00.000Z".isIsoDateFormat();
        expect(resultado).toBe(true);
      })
      it('"2021-01-01T03:00:00" deve ser true', () => {
        const resultado = "2021-01-01T03:00:00".isIsoDateFormat();
        expect(resultado).toBe(true);
      })
      it('"2021-01-01T03:00:00.00+03:00" deve ser true', () => {
        const resultado = "2021-01-01T03:00:00.00+03:00".isIsoDateFormat();
        expect(resultado).toBe(true);
      })
      it('"2021-01-01T03:00:00" deve ser false', () => {
        const resultado = "2021/01/01 03:00:00".isIsoDateFormat();
        expect(resultado).toBe(false);
      })
    })
    describe('replaceAll', () => {
      it('"abcabcabc" deve substituir a por x', () => {
        const resultado = "abcabcabc".replaceAll('a', 'x');
        expect(resultado).toBe("xbcxbcxbc");
      })
    })
  })
  describe('Date', () => {
    describe('addYears', () => {
      it('2020 deve virar 2021', () => {
        const resultado = new Date(2020, 1, 1).addYears(1);
        expect(resultado.getFullYear()).toBe(2021);
      })
      it('2020 deve virar 2019', () => {
        const resultado = new Date(2020, 1, 1).addYears(-1);
        expect(resultado.getFullYear()).toBe(2019);
      })
    })

    describe('addDays', () => {
      it('01/01/2021 deve virar 05/01/2021', () => {
        const resultado = new Date(2021, 0, 1).addDays(4);
        expect(resultado.getDate()).toBe(5);
        expect(resultado.getMonth()).toBe(0);
        expect(resultado.getFullYear()).toBe(2021);
      })
      it('01/01/2021 deve virar 31/12/2020', () => {
        const resultado = new Date(2021, 0, 1).addDays(-1);
        expect(resultado.getDate()).toBe(31);
        expect(resultado.getMonth()).toBe(11);
        expect(resultado.getFullYear()).toBe(2020);
      })
    })

    describe('format', () => {
      it('Deve formatar para 05/01/2021', () => {
        const resultado = new Date(2021, 0, 5).format("dd/MM/yyyy");
        expect(resultado).toBe("05/01/2021");
      })

      it('Deve formatar para 05/01/2021 10:20:30', () => {
        const resultado = new Date(2021, 0, 5, 10, 20, 30).format("dd/MM/yyyy HH:mm:ss");
        expect(resultado).toBe("05/01/2021 10:20:30");
      })
    })

    describe('tryParse', () => {
      it('Deve converter "2021-01-01T03:00:00.000Z"', () => {
        const resultado = Date.tryParse("2021-01-01T03:00:00.000Z");
        expect(resultado instanceof Date).toBeTruthy();
      })
      it('Não deve converter "2021-01-01T03:00:00"', () => {
        const resultado = Date.tryParse("2021-01-01T03:00:00");
        expect(resultado instanceof Date).toBeTruthy();
      })
      it('Não deve converter "2021-01-0103-00-00"', () => {
        const resultado = Date.tryParse("2021-01-0103-00-00");
        expect(typeof resultado).toBe('string');
      })
    })

    describe('File', () => {
      describe('toBase64', () => {
        it('Deve converter com DataType', async () => {
          //mock
          const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAA1JREFUGFdjYGBg+A8AAQQBAHAgZQsAAAAASUVORK5CYII='
          var arrayBuffer = Uint8Array.from(window.atob(base64), c => c.charCodeAt(0));
          var file = new File([arrayBuffer], "filename", { type: 'image/png' });
          //act
          const resultado = await file.toBase64(true);
          expect(resultado).toBe('data:image/png;base64,' + base64);
        })
        it('Deve converter sem DataType', async () => {
          //mock
          const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAA1JREFUGFdjYGBg+A8AAQQBAHAgZQsAAAAASUVORK5CYII='
          var arrayBuffer = Uint8Array.from(window.atob(base64), c => c.charCodeAt(0));
          var file = new File([arrayBuffer], "filename", { type: 'image/png' });
          //act
          const resultado = await file.toBase64();
          expect(resultado).toBe(base64);
        })
      })
    })
  })
})

export { }
