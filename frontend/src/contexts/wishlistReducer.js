export const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_WISHLIST":
      return { ...state, wishlistItems: action.payload };

    case "ADD_TO_WISHLIST":
      return { ...state, wishlistItems: [...state.wishlistItems, action.payload] };

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlistItems: state.wishlistItems.filter(
          (item) => item.ProductID !== action.payload
        ),
      };

    default:
      return state;
  }
};
