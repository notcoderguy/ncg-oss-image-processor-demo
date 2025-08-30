# Image Processing with WASM

This project demonstrates image processing techniques using WebAssembly (WASM) for high performance in web applications.

## Features

- Fast image processing using WASM
- Support for various image formats
- Easy integration with existing web applications

## Getting Started

To get started with this project, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/notcoderguy/ncg-oss-image-processor-wasm.git
cd ncg-oss-image-processor-wasm
cargo build --release
```

## Usage

To use the image processing functions, import the WASM module in your JavaScript code:

```javascript
import init, { process_image } from './pkg/image_processing_wasm.js';

async function run() {
    await init();
    const result = process_image(input_image);
    console.log(result);
}

run();
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
