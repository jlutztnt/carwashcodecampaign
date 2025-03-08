import CustomerForm from '../components/CustomerForm';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Car Wash Code Campaign</title>
        <meta name="description" content="Toot'n Totum Express Wash Code Campaign" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <CustomerForm />
      </main>
    </>
  );
}
