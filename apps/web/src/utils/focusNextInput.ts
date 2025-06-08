export function focusNextInput(event: React.KeyboardEvent, selector: string) {
  if (event.key === 'Enter') {
    event.preventDefault();

    const descriptionInput = document.querySelector(selector);
    if (descriptionInput) {
      (descriptionInput as HTMLInputElement).focus();
    }
  }
}
