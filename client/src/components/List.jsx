import "boxicons";
import { default as api } from "../store/apiSlice";
import Transaction from "./Transaction";
export default function List() {
  const { data, isFetching, isSuccess, isError } = api.useGetLabelsQuery();
  const [deleteTransaction] = api.useDeleteTransactionMutation();
  let Transactions;

  const handleDelete = (e) => {
    if (!e.target.dataset.id) return 0;
    console.log(e.target.dataset.id);
    deleteTransaction({ _id: e.target.dataset.id });
  };

  if (isFetching) {
    Transactions = <div>Загрузка...</div>;
  } else if (isSuccess) {
    Transactions = data?.map((v, i) => (
      <Transaction key={i} category={v} handle={handleDelete}></Transaction>
    ));
  } else if (isError) {
    Transactions = <div>Что-то пошло не так...</div>;
  }

  return (
    <div className="flex flex-col py-6 gap-3">
      <h1 className="py-4 font-bold text-xl">История</h1>
      {Transactions}
    </div>
  );
}
