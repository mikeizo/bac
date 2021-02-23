<?php

namespace Drupal\Tests\ga\Unit\EventSubscriber;

use Drupal\Core\Render\HtmlResponse;
use Drupal\csp\Csp;
use Drupal\csp\CspEvents;
use Drupal\csp\Event\PolicyAlterEvent;
use Drupal\csp\EventSubscriber\CoreCspSubscriber;
use Drupal\ga\EventSubscriber\CspSubscriber;
use Drupal\Tests\UnitTestCase;

/**
 * Test for Content Security Policy event integration.
 *
 * @group ga
 * @coversDefaultClass \Drupal\ga\EventSubscriber\CspSubscriber
 */
class CspSubscriberTest extends UnitTestCase {

  /**
   * The response object.
   *
   * @var \Drupal\Core\Render\HtmlResponse|\PHPUnit\Framework\MockObject\MockObject
   */
  private $response;

  /**
   * {@inheritdoc}
   */
  public function setUp() {
    parent::setUp();

    if (!class_exists(Csp::class)) {
      $this->markTestSkipped('Content Security Policy module is not available.');
    }

    $this->response = $this->getMockBuilder(HtmlResponse::class)
      ->disableOriginalConstructor()
      ->getMock();
  }

  /**
   * Check that the subscriber listens to the Policy Alter event.
   *
   * @covers ::getSubscribedEvents
   */
  public function testSubscribedEvents() {
    $this->assertArrayHasKey(CspEvents::POLICY_ALTER, CoreCspSubscriber::getSubscribedEvents());
  }

  /**
   * Shouldn't alter the policy if no directives are enabled.
   *
   * @covers ::onCspPolicyAlter
   */
  public function testNoDirectives() {
    $policy = new Csp();
    $alterEvent = new PolicyAlterEvent($policy, $this->response);

    $subscriber = new CspSubscriber();
    $subscriber->onCspPolicyAlter($alterEvent);

    $this->assertFalse($alterEvent->getPolicy()->hasDirective('default-src'));
    $this->assertFalse($alterEvent->getPolicy()->hasDirective('img-src'));
    $this->assertFalse($alterEvent->getPolicy()->hasDirective('connect-src'));
  }

  /**
   * Test that enabled required directives are modified.
   *
   * @covers ::onCspPolicyAlter
   */
  public function testDirectives() {
    $policy = new Csp();
    $policy->setDirective('default-src', [Csp::POLICY_ANY]);
    $policy->setDirective('img-src', [Csp::POLICY_SELF]);
    $policy->setDirective('connect-src', [Csp::POLICY_SELF]);

    $alterEvent = new PolicyAlterEvent($policy, $this->response);

    $subscriber = new CspSubscriber();
    $subscriber->onCspPolicyAlter($alterEvent);

    $this->assertArrayEquals(
      [Csp::POLICY_ANY],
      $alterEvent->getPolicy()->getDirective('default-src')
    );
    $this->assertArrayEquals(
      [Csp::POLICY_SELF, CspSubscriber::TRACKING_DOMAIN],
      $alterEvent->getPolicy()->getDirective('img-src')
    );
    $this->assertArrayEquals(
      [Csp::POLICY_SELF, CspSubscriber::TRACKING_DOMAIN],
      $alterEvent->getPolicy()->getDirective('connect-src')
    );
  }

  /**
   * Test img-src fallback if default-src enabled.
   *
   * @covers ::onCspPolicyAlter
   */
  public function testImgFallback() {
    $policy = new Csp();
    $policy->setDirective('default-src', [Csp::POLICY_SELF]);


    $alterEvent = new PolicyAlterEvent($policy, $this->response);

    $subscriber = new CspSubscriber();
    $subscriber->onCspPolicyAlter($alterEvent);

    $this->assertArrayEquals(
      [Csp::POLICY_SELF],
      $alterEvent->getPolicy()->getDirective('default-src')
    );
    $this->assertArrayEquals(
      [Csp::POLICY_SELF, CspSubscriber::TRACKING_DOMAIN],
      $alterEvent->getPolicy()->getDirective('img-src')
    );
  }

  /**
   * Test connect-src fallback if default-src enabled.
   *
   * @covers ::onCspPolicyAlter
   */
  public function testConnectFallback() {
    $policy = new Csp();
    $policy->setDirective('default-src', [Csp::POLICY_SELF]);


    $alterEvent = new PolicyAlterEvent($policy, $this->response);

    $subscriber = new CspSubscriber();
    $subscriber->onCspPolicyAlter($alterEvent);

    $this->assertArrayEquals(
      [Csp::POLICY_SELF],
      $alterEvent->getPolicy()->getDirective('default-src')
    );
    $this->assertArrayEquals(
      [Csp::POLICY_SELF, CspSubscriber::TRACKING_DOMAIN],
      $alterEvent->getPolicy()->getDirective('connect-src')
    );
  }

}
