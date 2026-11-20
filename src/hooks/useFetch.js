import { useEffect, useReducer } from "react";

const initialState = { loading: true, error: null, data: null };

function fetchReducer(state, action) {
  switch (action.type) {
    case "START":
      return { loading: true, error: null, data: null };
    case "SUCCESS":
      return { loading: false, error: null, data: action.data };
    case "FAILURE":
      return { loading: false, error: action.error, data: null };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// fetchFn gets an AbortSignal and must return a promise
// deps works like the dependency array of useEffect
export function useFetch(fetchFn, deps) {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: "START" });

    fetchFn(controller.signal)
      .then((data) => dispatch({ type: "SUCCESS", data }))
      .catch((error) => {
        // aborted on purpose (new deps or unmount), not a real error
        if (error.name === "AbortError") return;
        dispatch({ type: "FAILURE", error });
      });

    return () => controller.abort();
    // fetchFn is usually a new arrow function on every render,
    // so only deps decide when to fetch again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
