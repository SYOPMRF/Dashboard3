import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#ff0004"]}
        percentFillValue={80}
        cardInfo={{
          title: "lorem",
          value: "ipsum",
          text: "123",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#ff0004"]}
        percentFillValue={50}
        cardInfo={{
          title: "abc",
          value: "def",
          text: "lorem",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#ff0004"]}
        percentFillValue={40}
        cardInfo={{
          title: "lorem",
          value: "ipsum",
          text: "lorem",
        }}
      />
    </section>
  );
};

export default AreaCards;
