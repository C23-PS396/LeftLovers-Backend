import { Badge } from "@prisma/client";

const getBadge = (point: number) => {
  if (point < 1000) {
    return Badge.SATU;
  } else if (point < 2000) {
    return Badge.DUA;
  } else if (point < 5000) {
    return Badge.TIGA;
  } else {
    return Badge.EMPAT;
  }
};

export default getBadge;
