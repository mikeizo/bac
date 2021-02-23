<?php

namespace Drupal\ga\EventSubscriber;

use Drupal\csp\CspEvents;
use Drupal\csp\Event\PolicyAlterEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Alter CSP policy for Google Analytics.
 */
class CspSubscriber implements EventSubscriberInterface {

  const TRACKING_DOMAIN = 'https://www.google-analytics.com';

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    if (!class_exists(CspEvents::class)) {
      return [];
    }

    $events[CspEvents::POLICY_ALTER] = ['onCspPolicyAlter'];
    return $events;
  }

  /**
   * Alter CSP policy for tracking requests.
   *
   * @param \Drupal\csp\Event\PolicyAlterEvent $alterEvent
   *   The Policy Alter event.
   */
  public function onCspPolicyAlter(PolicyAlterEvent $alterEvent) {
    $policy = $alterEvent->getPolicy();

    if ($policy->hasDirective('img-src')) {
      $policy->appendDirective('img-src', [self::TRACKING_DOMAIN]);
    }
    elseif ($policy->hasDirective('default-src')) {
      $imgDirective = array_merge($policy->getDirective('default-src'), [self::TRACKING_DOMAIN]);
      $policy->setDirective('img-src', $imgDirective);
    }

    if ($policy->hasDirective('connect-src')) {
      $policy->appendDirective('connect-src', [self::TRACKING_DOMAIN]);
    }
    elseif ($policy->hasDirective('default-src')) {
      $connectDirective = array_merge($policy->getDirective('default-src'), [self::TRACKING_DOMAIN]);
      $policy->setDirective('connect-src', $connectDirective);
    }
  }

}
