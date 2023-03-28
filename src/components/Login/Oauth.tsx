const Oauth = () => {
  const searchParams = new URLSearchParams(document.location.search);
  const code = searchParams.get("code");
  console.log(code);
  //   if (!code) {
  //     navigatte("/login");
  //   }

  return <></>;
};

export default Oauth;
