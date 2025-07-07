import { useContext } from "react";
import { StateContext } from "../contexts/StateContext";

const useStateContext = () => useContext(StateContext);

export default useStateContext;
