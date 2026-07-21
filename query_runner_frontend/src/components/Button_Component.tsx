import React from 'react';
import { Button, Flex } from 'antd';
// Ant Design'ın kendi buton özelliklerinin tipini alıyoruz
import type { ButtonProps } from 'antd'; 

// Kendi prop tipimizi tanımlıyoruz. Ant Design özelliklerini de kapsasın istiyoruz.
interface CustomButtonProps extends ButtonProps {
  text?: string; // İster text prop'u ile yazı gönderebilirsin
}

const Button_Component: React.FC<CustomButtonProps> = ({ 
  text, 
  children, 
  type = "primary", // Varsayılan olarak primary (mavi) olsun
  ...restProps // Geri kalan tüm Ant Design proplarını (onClick, loading, disabled vb.) otomatik yakala
}) => (
  <Flex gap="small" wrap>
    <Button type={type} {...restProps}>
      {text || children || ""} 
    </Button>
  </Flex>
);

export default Button_Component;