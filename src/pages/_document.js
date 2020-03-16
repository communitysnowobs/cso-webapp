/**
 * @fileOverview Defines document template. Rehydrates server-rendered stylesheets
 * @author Jonah Joughin
 */

import Document, { Head, Main, NextScript } from 'next/document';
import { styletron } from '../styletron';

class CSODocument extends Document {
  static getInitialProps(props) {
    const page = props.renderPage(App => props => <App {...props} />);
    const stylesheets = styletron.getStylesheets() || [];
    return { ...page, stylesheets };
  }

  render() {
    return (
      <html>
        <Head>
          {this.props.stylesheets.map((sheet, i) => (
            <style
              className='_styletron_hydrate_'
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs['data-hydrate']}
              key={i}
            />
          ))}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

export default CSODocument;
