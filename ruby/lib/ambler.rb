require 'async'

module Ambler
  def self.amble(state, lead)
    current_state = state
    current_lead = lead

    Async do
      while current_lead
        current_state, current_lead = yield(current_lead, current_state)
      end
    end

    current_state
  end
end
