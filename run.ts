import { connect, StringCodec } from 'nats';

(async () => {
  const nc = await connect({ servers: 'localhost:4222' });
  const sc = StringCodec();

  const req = async (cmd: string, data: any = '') => {
    const msg = await nc.request(
      JSON.stringify({ cmd }),
      sc.encode(
        JSON.stringify({
          data,
          id: 'req',
        }),
      ),
    );

    console.log(sc.decode(msg.data));
  };

  // await req('get-by-id', '63679d37e4d684a6571f6a9c');
  // await req('get-all');
  // await req('delete', '63678fc18b695f61263c1abe');
  // await req('update', {
  //   id: '63679d37e4d684a6571f6a9c',
  //   cat: {
  //     name: 'minimus2',
  //   },
  // });

  // await req('create', {
  //   name: 'crassus',
  //   age: 3,
  //   breed: 'wild',
  // });

  // const msg = await nc.request(
  //   'cat-created',
  //   sc.encode(
  //     JSON.stringify({
  //       data: {
  //         name: 'new',
  //         age: 3,
  //         breed: 'some',
  //       },
  //       id: 'event',
  //     }),
  //   ),
  // );

  // console.log(sc.decode(msg.data));

  const sub = nc.subscribe('responses');
  (async () => {
    for await (const m of sub) {
      console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    }
    console.log('subscription closed');
  })();

  // nc.publish('responses', sc.encode('world'));
  // nc.publish('responses', sc.encode('again'));

  await nc.drain();
})();
