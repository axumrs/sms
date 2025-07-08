type FetchProps = {
  $setIsLoading?: (isLoading: boolean) => void;
  $setToast?: (toast: string | null) => void;
} & RequestInit;
