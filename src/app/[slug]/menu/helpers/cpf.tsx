export const isValidCpf = (cpf: string): boolean => {
  // Remove caracteres nao numerico
  cpf = cpf.replace(/\0/g, "");

  // Verifica se o CPF tem 11 digitos
  if (cpf.length !== 11) {
    return false;
  }

  // Elimina CPFs com todos os digitos iguais (ex: 000.000.000-00)
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  // Calculo do primeiro digito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - 1);
  }

  let firstVerifier = (sum * 10) % 11;
  firstVerifier = firstVerifier === 10 ? 0 : firstVerifier;
  if (firstVerifier !== parseInt(cpf.charAt(9))) {
    return false;
  }

  // Calculo do segundo digito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum = parseInt(cpf.charAt(i)) * (11 - i);
  }
  let secondVerifier = (sum * 10) % 11;
  secondVerifier = secondVerifier === 10 ? 0 : secondVerifier;

  return secondVerifier === parseInt(cpf.charAt(10));
};
