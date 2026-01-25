import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: false,
})
export class HighlightDirective implements OnInit {
  // Input property for highlight color
  @Input() appHighlight: string = 'yellow';

  // Input property for default color
  @Input() defaultColor: string = '';

  // Input property for hover color
  @Input() hoverColor: string = '#e3f2fd';

  // Private property to store original background color
  private originalBackgroundColor: string = '';

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  /**
   * Initialize directive
   */
  ngOnInit(): void {
    // Store original background color
    this.originalBackgroundColor = window.getComputedStyle(this.elementRef.nativeElement).backgroundColor;

    // Apply default color if provided
    if (this.defaultColor) {
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'backgroundColor',
        this.defaultColor
      );
    }
  }

  /**
   * Mouse enter event handler
   */
  @HostListener('mouseenter') onMouseEnter(): void {
    this.highlight(this.appHighlight || this.hoverColor);

    // Add transition effect
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transition',
      'background-color 0.3s ease'
    );

    // Add scale effect
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transform',
      'scale(1.02)'
    );

    // Add box shadow
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'boxShadow',
      '0 4px 8px rgba(0, 0, 0, 0.1)'
    );
  }

  /**
   * Mouse leave event handler
   */
  @HostListener('mouseleave') onMouseLeave(): void {
    this.highlight(this.defaultColor || this.originalBackgroundColor);

    // Remove scale effect
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'transform',
      'scale(1)'
    );

    // Remove box shadow
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'boxShadow',
      'none'
    );
  }

  /**
   * Highlight element with specified color
   */
  private highlight(color: string): void {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'backgroundColor',
      color
    );
  }
}

@Directive({
  selector: '[appClickEffect]'
})
export class ClickEffectDirective {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  /**
   * Click event handler
   */
  @HostListener('click') onClick(): void {
    // Add click effect
    this.renderer.addClass(this.elementRef.nativeElement, 'clicked');

    // Remove class after animation completes
    setTimeout(() => {
      this.renderer.removeClass(this.elementRef.nativeElement, 'clicked');
    }, 300);
  }
}

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements OnInit {
  constructor(
    private elementRef: ElementRef
  ) {}

  /**
   * Initialize directive
   */
  ngOnInit(): void {
    // Focus the element on initialization
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    }, 0);
  }
}
