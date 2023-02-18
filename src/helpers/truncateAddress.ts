export const truncateAddress = (addr: string) => {
  if (addr.length > 20) {
    return `${addr.substring(0, 5).toLowerCase()}...${addr
      .substring(addr.length - 4)
      .toUpperCase()}`;
  }
  return addr;
};
