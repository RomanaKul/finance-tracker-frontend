export interface Currency {
    _id?: string;
    date: Date;
    rates: {
      USD: {
        UAH: number;
        EUR: number;
      },
      UAH: {
        USD: number;
        EUR: number;
      },
      EUR: {
        USD: number;
        UAH: number;
      }
    }
  }



