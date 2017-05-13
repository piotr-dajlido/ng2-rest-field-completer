import { FieldCompleterPage } from './app.po';

describe('field-completer App', function() {
  let page: FieldCompleterPage;

  beforeEach(() => {
    page = new FieldCompleterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
