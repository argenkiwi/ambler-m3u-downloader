# frozen_string_literal: true

require 'async'

module Ambler
  class Next
    attr_reader :state

    def initialize(next_func, state)
      @next_func = next_func
      @state = state
    end

    def run
      @next_func.call(@state)
    end
  end

  def self.node(&factory)
    ->(state) { factory.call.call(state) }
  end

  def self.amble(initial, state)
    Async do
      next_val = initial.call(state)
      next_val = next_val.run while next_val
    end
  end
end
