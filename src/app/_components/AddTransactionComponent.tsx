"use client";

import { AddTransactionContainer } from "../actions/transactionActions";

export default async function InputNewTransaction() {
  const dostuff = () => {
    AddTransactionContainer([]);
  };

  return (
    <div>
      <h1>ya</h1>
      <button onClick={dostuff}>add a bunch of transactions</button>

      {/* {allstuff.map((thing) => (
        <h1>{thing.description}</h1>
      ))} */}
    </div>
  );
}
