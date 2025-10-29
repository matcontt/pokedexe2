import { TextInput, TextInputProps } from 'react-native';

export default function TextField(props: TextInputProps) {
  return (
    <TextInput
      {...props}
      className={`border border-gray-300 rounded-lg px-4 py-3 text-base ${props.className || ''}`}
      placeholderTextColor="#9ca3af"
    />
  );
}